import axios, {type AxiosResponse, type AxiosError} from "axios";

let isInterceptorSetup = false;

export const setupErrorHandlingInterceptor = () => {
    if(!isInterceptorSetup) {
        axios.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if(error.response) {
                    const statusCode = error.response.status;
                    const data = error.response.data as any;
                    
                    switch (statusCode) {
                        case 400:
                            const errors = data.errors || data.extensions?.errors || [];
                            
                            if (errors && Array.isArray(errors) && errors.length > 0) {
                                const modalStateErrors = [];
                                
                                for (const item of errors) {
                                    const property = item.Property || item.property;
                                    const errorMessage = item.ErrorMessage || item.errorMessage;
                                    
                                    if (property && errorMessage) {
                                        modalStateErrors.push({property, errorMessage});
                                    }
                                }
                                
                                console.log('Validation errors:', modalStateErrors);
                            } else {
                                console.log('Bad Request:', data);
                            }
                            break;
                            
                        case 401:
                            console.log('Unauthorized');
                            break;
                            
                        case 403:
                            console.log('Forbidden');
                            break;
                            
                        case 404:
                            console.log('Not Found');
                            break;
                            
                        default:
                            console.log('Generic Error:', statusCode, data);
                    }
                } else if (error.request) {
                    console.log('No response received:', error.request);
                } else {
                    console.log('Error setting up request:', error.message);
                }
                
                return Promise.reject(error);
            }
        )
        
        isInterceptorSetup = true;
    }
}