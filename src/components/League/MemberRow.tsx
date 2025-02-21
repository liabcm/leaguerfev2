import { X } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { LeagueUser } from '../../models/LeagueUser';
import ConfirmRemoveModal from '../General/ConfirmationModal';

const RemoveButton = styled.button`
  padding: 0.25rem;
  color: #6b7280;
  border-radius: 9999px;
  transition: all 0.2s;
  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    color: #ef4444;
    background-color: #e5e7eb;
  }
`;

const MemberRowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
`;

const MemberName = styled.span`
  font-size: 0.875rem;
`;

interface MemberRowProps {
  member: LeagueUser;
  isManaged?: boolean;
  onRemove: (memberId: string) => void;
}

const MemberRow = ({ member, isManaged = false, onRemove }: MemberRowProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleRemove = () => {
    onRemove(member.userId);
    setShowConfirmModal(false);
  };

  return (
    <>
      <MemberRowContainer>
        <MemberName>{member.name}</MemberName>
        {isManaged && (
          <RemoveButton onClick={() => setShowConfirmModal(true)}>
            <X size={16} />
          </RemoveButton>
        )}
      </MemberRowContainer>

      <ConfirmRemoveModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRemove}
        entityName={member.name}
      />
    </>
  );
};

export default MemberRow;
