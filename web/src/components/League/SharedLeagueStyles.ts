import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1);
  padding: clamp(1rem, 3vw, 2.5rem);
  width: 100%;
  margin-bottom: 2rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
`;

export const Badge = styled.span<{ $isPublic: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
  background-color: ${({ $isPublic }) => ($isPublic ? '#60a5fa' : '#6b7280')};
  color: white;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  flex: 1;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: clamp(
    1rem,
    3vw,
    1.5rem
  ); // Standardized to clamp for consistency
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: clamp(0.375rem, 1.5vw, 0.5rem);
  background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#4b5563')};
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  font-size: clamp(0.75rem, 2vw, 1rem);
`;

export const MembersSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

export const MembersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Count = styled.span`
  background-color: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 9999rem;
  font-size: 0.875rem;
`;

export const MembersList = styled.div`
  display: grid;
  gap: 0.5rem;
  max-height: clamp(9.375rem, 50vh, 12.5rem);
  overflow-y: auto;
`;

export const Member = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

export const HoverableMember = styled.div`
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: rgb(81, 111, 169);
  }
`;

export const EventsSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: clamp(1rem, 3vw, 1.5rem);
`;

export const EventsHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Button = styled.button`
  padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem);
  border-radius: 0.25rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1vw, 0.5rem);
  background-color: #0066cc;
  border: none;
  color: white;
  &:hover {
    background-color: #0052a3;
  }
`;

export const ActionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
