import 'semantic-ui-css/semantic.min.css'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // TODO: w/o these I have 2 warnings: findDOMNode is deprecated
  // unfortunately, even w/ these there is still one warning
  // <StrictMode>
    <App />
  // </StrictMode>,
)
