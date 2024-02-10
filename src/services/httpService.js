import axios from "axios";
import { toast } from "react-toastify";
import logger from './logService';

//axios.interceptors.response.use(success,error)-template
axios.interceptors.response.use(null, error => {
  console.log("INTERCEPTOR BLOCK");
  const expectedError = (error.response && error.response >= 400 && error.response < 500);
  if (!expectedError) {//checking for unexpected error
      //console.log("logging in the error", error);
           //alert("Sorry, unexpected error occured"); replacing with {toast}
      
           //Raven.captureException(error);
      logger.log(error);//calling the function from logservice.js
      toast.error("Sorry, unexpected error occured");
  }
  return Promise.reject(error);
});
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};