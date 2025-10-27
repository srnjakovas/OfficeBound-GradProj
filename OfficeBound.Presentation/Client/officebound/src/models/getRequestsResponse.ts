import type {RequestDto} from "./requestDto.ts";

export interface GetRequestsResponse {
    requestsDtos: RequestDto[];
}