import { Board } from './components/Board/Board';
import { NumberPad } from './components/Controls/NumberPad';
import { NoteToggle } from './components/Controls/NoteToggle';
import { ActionBar } from './components/Controls/ActionBar';
import { RoomCodeBar } from './components/Controls/RoomCodeBar';
import { StartButton } from './components/Controls/StartButton';
import { StatusBanner } from './components/StatusBanner';
import { Timer } from './components/Timer';
import { BestTimeBadge } from './components/BestTimeBadge';

export const App = () => {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">数独</h1>
        <div className="app__header-right">
          <BestTimeBadge />
          <Timer />
        </div>
      </header>
      <main className="app__main">
        <ActionBar />
        <RoomCodeBar />
        <StatusBanner />
        <div className="app__board-wrap">
          <Board />
          <StartButton />
        </div>
        <div className="app__controls">
          <NoteToggle />
          <NumberPad />
        </div>
      </main>
    </div>
  );
};

export default App;
