import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { EventFormData } from '../../../models/EventTypes';
import { Field, Input, Label, StepContainer } from './StepStyled';

type Props = {
  formData: EventFormData;
  setFormData: (data: EventFormData) => void;
  validate: () => void;
};

export const BaseInfoStep = ({ formData, setFormData, validate }: Props) => {
  const handleDateTimeChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, eventTime: date });
      validate();
    }
  };

  return (
    <StepContainer>
      <h2>Event Details</h2>

      <Field>
        <Label>Location *</Label>
        <Input
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
            validate();
          }}
          required
        />
      </Field>

      <Field>
        <Label>Date & Time *</Label>
        <StyledDatePicker
          selected={formData.eventTime}
          onChange={handleDateTimeChange}
          showTimeSelect
          timeFormat='h:mm aa'
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='MMMM d, yyyy h:mm aa'
          minDate={new Date()}
          selectsStart
          wrapperClassName='date-picker-wrapper'
          popperClassName='date-picker-popper'
        />
      </Field>

      {/* Add other form fields here */}
    </StepContainer>
  );
};

const StyledDatePicker = styled(DatePicker).attrs({
  className: 'date-picker-input',
})`
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
