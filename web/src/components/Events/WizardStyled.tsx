import styled from 'styled-components';

export const WizardContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const ProgressBar = styled.div<{
  $totalSteps: number;
  $currentStep: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$totalSteps}, 1fr);
  gap: 0.5rem;
  margin-bottom: 2rem;

  div {
    height: 4px;
    background: #eee;
    border-radius: 2px;

    &.active {
      background: #007bff;
    }
  }
`;

export const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

export const Error = styled.div`
  color: #dc3545;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background: #fff5f5;
`;
