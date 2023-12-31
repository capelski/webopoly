import React, { CSSProperties } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  closeHandler?: () => void;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const Modal: React.FC<ModalProps> = (props) => {
  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <ReactModal
        isOpen={true}
        onRequestClose={props.closeHandler}
        style={{
          content: { display: 'flex', flexDirection: 'column', inset: 20 },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            ...props.style,
          }}
        >
          {props.children}
        </div>
      </ReactModal>
    </div>
  );
};
