import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { League } from '../models/League';
import { useLeagueApi } from '../api/useLeagueApi';

const CreateLeagueForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<League>({
    defaultValues: {
      sport: 'Basketball',
      isPublic: true,
      isCompetitive: false
    }
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const leagueApi = useLeagueApi();
  const navigate = useNavigate();

  const sportsOptions = [
    'Basketball',
    'Football',
    'Soccer',
    'Baseball',
    'Tennis',
    'Volleyball',
  ];
  
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    navigate(-1);
  };

  const onSubmit = (data: League) => {
    console.log('Form data:', data);
    leagueApi.createLeague(data);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <button
        type="button" // Changed to type="button"
        onClick={handleBack}
        className="absolute top-5 left-5 px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors z-10"
      >
        ← Back
      </button>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
        <div className="mb-4">
          <label htmlFor="sport" className="block mb-2">Sport:</label>
          <select 
            disabled={!isEditing} 
            id="sport" 
            className="w-full p-2 border rounded"
            {...register("sport")}
          >
            {sportsOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">League Name:</label>
          <input
            id="name"
            type="text"
            disabled={!isEditing}
            className="w-full p-2 border rounded"
            {...register("name", { required: "League name is required" })}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              disabled={!isEditing}
              className="mr-2"
              {...register("isPublic")}
            />
            Public League
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              disabled={!isEditing}
              className="mr-2"
              {...register("isCompetitive")}
            />
            Competitive
          </label>
        </div>

        {isEditing ? (
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Save League
          </button>
        ) : (
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Edit League
          </button>
        )}
      </form>
    </div>
  );
};

export default CreateLeagueForm;