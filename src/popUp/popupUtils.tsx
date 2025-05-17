import ReactDOMClient from 'react-dom/client';
import Popup from './Popup';

let popupRoot: HTMLDivElement | null = null;

export function mostrarPopup(mensagem: string) {
  if (popupRoot) return;

  popupRoot = document.createElement('div');
  document.body.appendChild(popupRoot);

  const root = ReactDOMClient.createRoot(popupRoot);

  const fecharPopup = () => {
    root.unmount(); 
    document.body.removeChild(popupRoot!);
    popupRoot = null;
  };

  root.render(<Popup visible={true} onClose={fecharPopup} mensagem={mensagem} />);
}
