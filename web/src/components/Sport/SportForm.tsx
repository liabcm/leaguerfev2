import { useEffect, useState } from 'react';
import { useLeagueApi } from '../../api/useLeagueApi';
import { Sport } from '../../models/Sport';

const SportForm = () => {
  const { createSport, getAllSports } = useLeagueApi();
  const [sports, setSports] = useState<Sport[]>([]);
  const [formData, setFormData] = useState<Omit<Sport, 'id'>>({
    name: '',
    isTeamSport: false,
    description: '',
  });

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      const data = await getAllSports();
      setSports(data);
    } catch (error) {
      console.error('Error loading sports:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSport(formData);
      await loadSports(); // Refresh the list after creation
      setFormData({ name: '', isTeamSport: false, description: '' });
    } catch (error) {
      console.error('Error creating sport:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className='sport-container'>
      <form onSubmit={handleSubmit} className='sport-form'>
        <h2>Create New Sport</h2>

        <div className='form-group'>
          <label htmlFor='name'>Sport Name:</label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className='form-group checkbox-group'>
          <label htmlFor='isTeamSport'>Team Sport:</label>
          <input
            type='checkbox'
            id='isTeamSport'
            name='isTeamSport'
            checked={formData.isTeamSport}
            onChange={handleChange}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Description:</label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type='submit' className='submit-btn'>
          Create Sport
        </button>
      </form>

      <div className='sports-list'>
        <h3>Existing Sports</h3>
        {sports.length === 0 ? (
          <p>No sports found</p>
        ) : (
          <ul>
            {sports.map((sport) => (
              <li key={sport.id} className='sport-item'>
                <h4>{sport.name}</h4>
                <p>{sport.description}</p>
                <small>
                  {sport.isTeamSport ? 'Team Sport' : 'Individual Sport'}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SportForm;
