import CodolioIframe from './CodolioIframe';

export default function CodolioProfile({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Codolio Profile</h2>
        <CodolioIframe section="profile" height="600px" />
      </div>
    </div>
  );
}