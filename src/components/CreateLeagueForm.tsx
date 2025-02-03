import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface FormData {
  sport: string;
  name: string;
  isPublic: boolean;
  isCompetitive: boolean;
}

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

const CreateLeagueForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      sport: 'Basketball',
      isPublic: true,
      isCompetitive: false
    }
  });

  const[isEditing, setIsEditing] = useState<boolean>(true);

  const sportsOptions = [
    'Basketball',
    'Football',
    'Soccer',
    'Baseball',
    'Tennis',
    'Volleyball',
  ];

  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); // Go back one page in history
  };

  const onSubmit = (data: FormData) => {
    // Will be called when form is valid
    console.log('Form data:', data);
    setIsEditing(false);
    // Implement save logic here later
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
      <BackButton onClick={handleBack}>← Back</BackButton>
        <label htmlFor="sport">Sport:</label>
        <select disabled={!isEditing} id="sport" {...register("sport")}>
          {sportsOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="name">League Name:</label>
        <input
          id="name"
          type="text"
          disabled={!isEditing}
          {...register("name", { required: "League name is required" })}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>
          Public League:
          <input
            type="checkbox"
            disabled={!isEditing}
            {...register("isPublic")}
          />
        </label>
      </div>

      <div>
        <label>
          Competitive:
          <input
            type="checkbox"
            disabled={!isEditing}
            {...register("isCompetitive")}
          />
        </label>
      </div>

    {isEditing &&<button type="submit">
        Save League
      </button> }
      {!isEditing && <button type="button" onClick={()=>setIsEditing(true)}>
        Edit League
      </button>}
    </form>
  );
};

export default CreateLeagueForm;