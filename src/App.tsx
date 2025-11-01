import { MainContent } from './containers/MainContent';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
