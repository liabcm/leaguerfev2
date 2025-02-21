import React from 'react';
import styled from 'styled-components';

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
}

// The base button styling can be extended or overridden by styled-components.
const BaseButton = styled.button<{ isloading: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  opacity: ${({ isloading }) => (isloading ? 0.7 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const SmallSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  disabled,
  ...rest
}) => {
  return (
    <BaseButton
      disabled={isLoading || disabled}
      isloading={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ButtonContent>
          <SmallSpinner />
          {loadingText}
        </ButtonContent>
      ) : (
        children
      )}
    </BaseButton>
  );
};

export default LoadingButton;
