import React from 'react';

interface ShowBannerProps {
  msg: string;
  type: 'error' | 'info' | 'success' | 'warning'; 
}

const ShowBanner: React.FC<ShowBannerProps> = ({ type, msg }) => {
  const getColors = () => {
    switch (type) {
      case 'error':
        return { bgColor: 'bg-red-200', textColor: 'text-red-800', icon: '❌' };
      case 'info':
        return { bgColor: 'bg-blue-200', textColor: 'text-blue-800', icon: 'ℹ️' };
      case 'success':
        return { bgColor: 'bg-green-200', textColor: 'text-green-800', icon: '✅' };
      case 'warning':
        return { bgColor: 'bg-yellow-200', textColor: 'text-yellow-800', icon: '⚠️' };
      default:
        return { bgColor: 'bg-gray-200', textColor: 'text-gray-800', icon: '' }; 
    }
  };

  const { bgColor, textColor, icon } = getColors();

  return (
    <div className={`${bgColor} ${textColor} p-3 rounded-md m-6 flex items-center`}>
      {icon && <span className="mr-2 text-lg">{icon}</span>}
      <p className="text-sm font-medium">{msg}</p>
    </div>
  );
};

export default ShowBanner;