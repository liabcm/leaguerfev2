import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <button
      type='button'
      onClick={handleBack}
      className='absolute left-5 top-5 px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors z-10'
    >
      ← Back
    </button>
  );
};

export default BackButton;
