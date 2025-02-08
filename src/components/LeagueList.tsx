import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useLeagueApi } from '../api/useLeagueApi';
import { League } from '../models/League';

const LeaguesList = () => {
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState<League[]>([]);
  const leagueApi = useLeagueApi();

useEffect(() => {
  const fetchLeagues = async () => {
    try {
      const result = await leagueApi.getAllLeagues();
      setLeagues(result);
    } catch (error) {
      console.error('Failed to fetch leagues:', error);
    }
  };

  fetchLeagues();
}, []);
  
  const handleBack = () => {
    navigate(-1); // Go back one page in history
  };
  // Static list of 10 leagues (same as before)

  return (
    <StyledLeaguesList>
      <BackButton onClick={handleBack}>← Back</BackButton>
      <HeaderContainer>
        <StyledHeading>List of Leagues</StyledHeading>
      </HeaderContainer>
      
      <ListContainer>
        {leagues.map((league, index) => (
          <LeagueItem key={index}>
            <FlexContainer>
              <div>
                <LeagueName>{league.name}</LeagueName>
                <SportName>{league.sport}</SportName>
              </div>
              <div>
                <Badge variant={league.isPublic ? 'public' : 'private'}>
                  {league.isPublic ? 'Public' : 'Private'}
                </Badge>
                <Badge variant={league.isCompetitive ? 'competitive' : 'casual'}>
                  {league.isCompetitive ? 'Competitive' : 'Casual'}
                </Badge>
              </div>
            </FlexContainer>
          </LeagueItem>
        ))}
      </ListContainer>
    </StyledLeaguesList>
  );
};

export default LeaguesList;

const StyledLeaguesList = styled.div`
  max-width: 800px;
  margin: 20px auto;
  position: relative;
  padding-top: 50px; // Add padding to prevent content overlap
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 1;

  &:hover {
    background-color: #e0e0e0;
  }
`;

// Update HeaderContainer to center the title
const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const LeagueItem = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledHeading = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ListContainer = styled.div`
  padding: 0 15px;
`;

const LeagueName = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SportName = styled.div`
  color: #666;
  margin-bottom: 8px;
`;

const Badge = styled.span<{ variant: 'public' | 'private' | 'competitive' | 'casual' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  margin-right: 8px;

  ${({ variant }) => {
    switch(variant) {
      case 'public':
        return `background-color: #e6f4ea; color: #137333;`;
      case 'private':
        return `background-color: #fce8e6; color: #c5221f;`;
      case 'competitive':
        return `background-color: #e8f0fe; color: #1a73e8;`;
      case 'casual':
        return `background-color: #fef7e0; color: #f9ab00;`;
    }
  }}
`;