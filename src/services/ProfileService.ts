import { fetchData, handleErrorResponse, patchFormData } from './ApiUtility';

export interface ProfileObj {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
}

class ProfileService {
  baseUrl = '/users';

  getCurrentUserProfile = async () => {
    const url = `${this.baseUrl}/me`;
    const res = await fetchData(url);

    console.log('this is the current user profile api response ===>', res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    // TanStack Query does not allow undefined - must return null or a value
    const profile = res.data ?? null;
    return profile;
  };

  getTravelPreferences = async () => {
    const url = `${this.baseUrl}/me/travel-preferences`;
    const res = await fetchData<{ home: string | null; office: string | null; officeTimings: string | null }>(url);

    if (!res.success) {
      handleErrorResponse(res);
    }
    return res.data ?? { home: null, office: null, officeTimings: null };
  };

  /**
   * Converts DD/MM/YYYY to YYYY-MM-DD for API
   */
  private formatDateForApi = (dateStr: string): string => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  updateProfile = async (profileObj: ProfileObj, profileImageUri: string | null) => {
    const url = `${this.baseUrl}/profile`;
    const formData = new FormData();

    // Append profile image if selected
    if (profileImageUri) {
      const fileName = profileImageUri.split('/').pop() || 'profile.jpg';
      const fileType = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      formData.append('profile', {
        uri: profileImageUri,
        type: fileType,
        name: fileName,
      } as any);
    }

    if (profileObj.emailAddress) {
      formData.append('email', profileObj.emailAddress);
    }
    if (profileObj.gender) {
      formData.append('gender', profileObj.gender.toUpperCase());
    }
    const dateOfBirth = this.formatDateForApi(profileObj.dateOfBirth);
    if (dateOfBirth) {
      formData.append('dateOfBirth', dateOfBirth);
    }

    // Optional fields - add if API supports
    // if (profileObj.fullName) {
    //   formData.append('fullName', profileObj.fullName);
    // }
    // if (profileObj.mobileNumber) {
    //   formData.append('mobileNumber', profileObj.mobileNumber);
    // }
    // if (profileObj.bloodGroup) {
    //   formData.append('bloodGroup', profileObj.bloodGroup);
    // }

    console.log("This is formData payload ===>", formData);

    const res = await patchFormData(url, formData);
    console.log("This is response of patch profile data ===>", res)

    if (!res.success) {
      handleErrorResponse(res);
    }

    return res.data;
  };
}

export default new ProfileService();
