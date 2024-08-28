import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = forwardRef(function Modal({ children, 
    cancelButtonCaption, 
    proceedButtonCaption, 
    onCancel, 
    onProceed, 
    isDanger }, ref) {

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
      <button 
        class="modal-close is-large has-background-black" 
        aria-label="close"
        onClick={onCancel}
      />
      <br></br>
      <br></br>
      {children}
      <form method="dialog" className="mt-4 text-right">
        <button onClick={onCancel} class="button">{cancelButtonCaption}</button>
        <button 
            onClick={onProceed} 
            class={`button ${isDanger === 'True' && 'is-danger'}`}
            >
              {proceedButtonCaption}
        </button>
      </form>
    </dialog>,
    document.getElementById('modal-root')
  );
});

export default Modal;