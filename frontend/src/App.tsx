import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Recording } from '@/pages/Recording';
import { Processing } from '@/pages/Processing';
import { Report } from '@/pages/Report';
import { History } from '@/pages/History';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recording" element={<Recording />} />
          <Route path="processing" element={<Processing />} />
          <Route path="report/:id" element={<Report />} />
          <Route path="history" element={<History />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
