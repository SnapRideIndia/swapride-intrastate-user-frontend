import { postData, fetchData, deleteData, handleErrorResponse } from './ApiUtility';
import { API_ENDPOINTS } from './endpoints';
import type { CreateStopSuggestionDto, SuggestionsListResponse } from '../types/suggestion.types';

class SuggestionService {
  createStopSuggestion = async (dto: CreateStopSuggestionDto) => {
    const url = API_ENDPOINTS.SUGGESTIONS.CREATE;
    const res = await postData<{ id: string }>(url, dto);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data;
  };

  listMySuggestions = async (offset: number = 0, limit: number = 10) => {
    const url = API_ENDPOINTS.SUGGESTIONS.ME;
    const res = await fetchData<SuggestionsListResponse>(url, { params: { offset, limit } });
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data;
  };

  deleteSuggestion = async (id: string) => {
    const url = API_ENDPOINTS.SUGGESTIONS.DELETE(id);
    const res = await deleteData(url);
    if (!res.success) {
      handleErrorResponse(res);
    }
  };
}

export default new SuggestionService();
