import Modal from 'react-modal';
import styled from 'styled-components';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string; // Changed from memberName to be more generic
  action?: string; // Optional action text
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  action = 'remove', // Default to "remove" if not specified
}: ConfirmationModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      ariaHideApp={false}
    >
      <ModalContent>
        <Title>Confirm {action}</Title>
        <Message>
          Are you sure you want to {action.toLowerCase()} {entityName}? This
          action cannot be undone.
        </Message>
        <ButtonContainer>
          <Button onClick={onClose}>Cancel</Button>
          <Button $variant='danger' onClick={onConfirm}>
            {action}
          </Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

const ModalContent = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Message = styled.p`
  margin-bottom: 2rem;
  color: #4b5563;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: ${({ $variant }) =>
    $variant === 'danger' ? '#ef4444' : '#6b7280'};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '400px',
    width: '90%',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};
