import { toast, ToastContent } from 'react-toastify';

export const errorToast = (content: ToastContent) => {
  toast(content, {
    type: 'error',
    autoClose: 3000,
  });
};
