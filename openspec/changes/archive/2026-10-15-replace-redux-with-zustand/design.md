# Design

Create a vanilla Zustand store per mounted game session with createStore. React's
useStore subscribes the game component; Node tests instantiate the same production
store directly. A singleton or Provider is unnecessary for a single-screen session.

Store actions start the game, tick elapsed/remaining time, answer an option, and
advance after feedback. The store derives correctness and damage feedback itself,
and rejects input during the overlay, feedback, after completion, or for an already
selected option. Score and completion snapshots are updated atomically.

useGame owns the interval and 500 ms timeout in separate effects. Timer ticks do
not restart feedback. Effects clean up on completion/unmount; a pathname key starts
a new game store on direct game route changes. Enable StrictMode to exercise cleanup.

I18nPage reads the static dictionary using the existing language URL and supplies
messages/lang to pages. Non-game pages need no store subscription. Preserve the
existing JSX/CSS rather than rewriting unrelated page components.

The known speedrun defense link and 3-versus-20 target remain step 4. Offline tooling
and deployment remain step 5. Test those boundaries without declaring the defects
correct requirements.
