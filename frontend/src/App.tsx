import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Episode } from "./types";
import Input from "./Input";

import "./App.css";
import Article from "./components/article/Article";
import Layout from "./Layout";
import NoResults from "./components/actions/NoResults";
import SpinningBrickLoader from "./components/actions/SpinningBrickLoader";
import SearchPage from "./pages/SearchPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Default search page */}
          <Route path="/" element={<SearchPage />} />{" "}
          <Route path="/ask" element={<ChatPage />} /> {/* AI Chat UI */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
