import { useWebAppPopup } from 'vue-tg'


export const doAction = async (options: {
	title: string
	message: string
  buttonText: string
}) => {
  return new Promise((resolve) => {
    const { showPopup, onPopupClosed } = useWebAppPopup()
    
    const popupClosed = onPopupClosed(async (e) => {
      if (e.button_id !== 'cancel') {
        resolve(false)
        popupClosed.off()
        return
      }
      resolve(true)
    }, { manual: true })

    showPopup({
      title: options.title,
      message: options.message,
      buttons: [
        { id: 'cancel', type: 'default', text: options.buttonText },
        { text: 'Закрыть', type: 'destructive' },
      ],
    })
  })
}