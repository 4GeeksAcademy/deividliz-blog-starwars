import React from 'react'; 
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout"; 
import { Home } from "./pages/Home";   
import { DetailView } from "./pages/DetailView";

export const router = createBrowserRouter(
    createRoutesFromElements(
         <Route path="/" element={<Layout />}>                  
            <Route index element={<Home />} />
            <Route path="/details/:type/:uid" element={<DetailView />} />
        </Route> 
    )
);