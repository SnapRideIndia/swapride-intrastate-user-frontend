export interface GooglePlacePrediction {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting?: {
        main_text: string;
        secondary_text?: string;
        main_text_matched_substrings?: Array<{ length: number; offset: number }>;
    };
    matched_substrings?: Array<{ length: number; offset: number }>;
    terms?: Array<{ offset: number; value: string }>;
    types?: string[];
}

export interface PlaceDetailsResponse {
    postalCode: string | null;
    locality: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    formattedAddress: string | null;
}

export const fetchAutocompleteResults = async (
    query: string,
    apiKey: string,
    countryCode: string = 'in'
): Promise<GooglePlacePrediction[]> => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&components=country:${countryCode}`;

    try {
        const response = await fetch(url);
        const json = await response.json();
        // console.log("this is nearby place response ===>", json)
        return (json?.predictions || []) as GooglePlacePrediction[];
    } catch (error) {
        // console.error('Failed to fetch predictions:', error);
        return [];
    }
};


export const fetchPlaceDetails = async (placeId: string, apiKey: string): Promise<PlaceDetailsResponse | null> => {
    // console.log("This is place_id inside placeDetails api ===>", placeId)
    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component,formatted_address,geometry&key=${apiKey}`;

    try {
        const response = await fetch(placeDetailsUrl);
        const json = await response.json();

        if (!json.result) return null;
        const components = json.result.address_components || [];
        // console.log("this is also address components ===>", components)

        const findFirst = (types: string[]): string | null => {
            for (const t of types) {
                const comp = components.find((c: any) => Array.isArray(c.types) && c.types.includes(t));
                if (comp?.long_name) return comp.long_name;
            }
            return null;
        };

        // In India, locality is often under sublocality levels; city under locality or admin_area_level_2
        let postalCode = findFirst(['postal_code']);
        let locality = findFirst([
            'sublocality_level_3',
            'sublocality_level_2',
            'sublocality_level_1',
            'sublocality',
            'neighborhood',
            'locality',
            'administrative_area_level_3', // tehsil/taluk sometimes
        ]);
        let city = findFirst([
            'locality',
            'administrative_area_level_2',
            'administrative_area_level_3',
        ]);
        let state = findFirst(['administrative_area_level_1']);
        let country = findFirst(['country']);
        const formattedAddress = json.result.formatted_address as string | null;

        // Fallback: if any key part missing → use Geocoding API by lat/lng and scan all results
        if ((!postalCode || !city || !locality) && json.result.geometry?.location) {
            const { lat, lng } = json.result.geometry.location;
            const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
            const geoRes = await fetch(geoUrl);
            const geoJson = await geoRes.json();

            if (Array.isArray(geoJson.results) && geoJson.results.length) {
                // Prefer more specific results first
                for (const r of geoJson.results) {
                    const gc = r.address_components || [];
                    const findInGc = (types: string[]): string | null => {
                        for (const t of types) {
                            const comp = gc.find((c: any) => Array.isArray(c.types) && c.types.includes(t));
                            if (comp?.long_name) return comp.long_name;
                        }
                        return null;
                    };

                    postalCode = postalCode || findInGc(['postal_code']);
                    locality = locality || findInGc([
                        'sublocality_level_3',
                        'sublocality_level_2',
                        'sublocality_level_1',
                        'sublocality',
                        'neighborhood',
                        'locality',
                        'administrative_area_level_3',
                    ]);
                    city = city || findInGc(['locality', 'administrative_area_level_2', 'administrative_area_level_3']);
                    state = state || findInGc(['administrative_area_level_1']);
                    country = country || findInGc(['country']);

                    if (postalCode && city && locality && state && country) break;
                }
            }
        }

        return {
            postalCode: postalCode || null,
            locality: locality || null,
            city: city || null,
            state: state || null,
            country: country || null,
            formattedAddress,
        };
    } catch (error) {
        console.error('Failed to fetch place details:', error);
        return null;
    }
};

export const fetchPlaceDetailsByCoords = async (
    latitude: number,
    longitude: number,
    apiKey: string
): Promise<PlaceDetailsResponse | null> => {
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(geoUrl);
        const json = await response.json();

        if (!json.results?.length) return null;

        const result = json.results[0];
        const components = result.address_components || [];

        const findFirst = (types: string[]): string | null => {
            for (const t of types) {
                const comp = components.find(
                    (c: any) => Array.isArray(c.types) && c.types.includes(t)
                );
                if (comp?.long_name) return comp.long_name;
            }
            return null;
        };

        const postalCode = findFirst(["postal_code"]);
        const locality = findFirst([
            "sublocality_level_3",
            "sublocality_level_2",
            "sublocality_level_1",
            "sublocality",
            "neighborhood",
            "locality",
            "administrative_area_level_3",
        ]);
        const city = findFirst([
            "locality",
            "administrative_area_level_2",
            "administrative_area_level_3",
        ]);
        const state = findFirst(["administrative_area_level_1"]);
        const country = findFirst(["country"]);
        const formattedAddress = result.formatted_address || null;

        return {
            postalCode: postalCode || null,
            locality: locality || null,
            city: city || null,
            state: state || null,
            country: country || null,
            formattedAddress,
        };
    } catch (error) {
        console.error("Failed to fetch place details by coordinates:", error);
        return null;
    }
};
