import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

const base = {
  position: 'topRight',
  progressBar: true,
  transitionIn: 'fadeInRight',
  transitionOut: 'fadeOutRight',
  zindex: 9999,
}

export const showSuccess = (message = 'Success') =>
  iziToast.show({
    ...base,
    title: 'Success',
    message,
    timeout: 2800,
    backgroundColor: '#4BB543',
  })

export const showError = (message = 'Error') =>
  iziToast.show({
    ...base,
    title: 'Error',
    message,
    timeout: 3200,
    backgroundColor: '#FF4C4C',
  })

export const showWarning = (message = 'Warning') =>
  iziToast.show({
    ...base,
    title: 'Warning',
    message,
    timeout: 3000,
    backgroundColor: '#FFAA33',
    layout: 2,
    maxWidth: 400,
    padding: 20,
  })

export const showCommentLimit = () =>
  showWarning('Comment cannot exceed 30 characters')

export default {
  showSuccess,
  showError,
  showWarning,
  showCommentLimit,
}

