import { Datepicker } from '@datepicker-react/styled';
import styled from 'styled-components';

export const StepContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Field = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
`;

export const Error = styled.div`
  color: #dc3545;
  padding: 0.5rem 0;
  font-size: 0.9rem;
`;

export const StyledDatePicker = styled(Datepicker)`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
`;

export const SummaryContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

export const SummaryTitle = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

export const SummarySection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  h3 {
    color: #495057;
    margin-bottom: 1rem;
  }
`;

export const SummaryItem = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  color: #212529;

  strong {
    color: #343a40;
    margin-right: 0.5rem;
  }
`;
