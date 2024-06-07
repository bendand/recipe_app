import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children, cancelButtonCaption, proceedButtonCaption, onCancel, onProceed }, ref) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      }
    };
  });


  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
    >
      {children}
      <form method="dialog" className="mt-4 text-right">
        <button onClick={onCancel}>{cancelButtonCaption}</button>
        <button onClick={onProceed}>{proceedButtonCaption}</button>
      </form>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default Modal;