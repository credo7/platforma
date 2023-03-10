import React from "react";

import { Switch } from "react-router-dom";

import PrivateRoute from "Common/components/Routes/PrivateRoute";
import PublicRoute from "Common/components/Routes/PublicRoute";
import AdminRoute from "Common/components/Routes/AdminRoute";

import AdminNotification from "Common/pages/Notifications/AdminNotification";
import AdminTournamentPage from "Common/pages/Tournament/AdminTournament/AdminTournamentPage";
import ChatRoomPage from "Common/pages/Chat/ChatRoomPage";
import ChatRoomsPage from "Common/pages/Chat/ChatRoomsPage";
import FaqPage from "Common/pages/Faq/FaqPage";
import GamesPage from "Common/pages/Games/GamesPage";
import GamesProfilePage from "Common/pages/GamesProfile/GamesProfilePage";
import MainPage from "Common/pages/Main/MainPage";
import NotificationsPage from "Common/pages/Notifications/NotificationsPage";
import ProfilePage from "Common/pages/Profile/ProfilePage";
import RatingPlayersPage from "Common/pages/Rating/RatingPlayersPage";
import PlayerSettingsPage from "Common/pages/PlayerSettings/PlayerSettingsPage";
import TeamProfilePage from "Common/pages/TeamProfile/TeamProfilePage";
import TeamSettingsPage from "Common/pages/TeamSettings/TeamSettingsPage";
import TournamentPage from "Common/pages/Tournament/TournamentPage";
import TournamentsPage from "Common/pages/Tournaments/TournamentsPage";
import RatingTeamsPage from "Common/pages/Rating/RatingTeamsPage";
import ReglamentTournamentTeam from "../components/ReglamentTournamentTeam";

import Wallets from "Wallets";

const Pages = () => {
  return (
    <Switch>
      {/* PUBLIC */}
      <PublicRoute exact path="/" component={MainPage} />

      {/* PRIVATE */}
      <PrivateRoute path="/wallets" component={Wallets} />

      <PrivateRoute exact path="/games" component={GamesPage} />
      <PrivateRoute path="/games/:gameId" component={GamesProfilePage} />
      <PrivateRoute path="/faq/:tabName?" component={FaqPage} />
      <PrivateRoute exact path="/rating" component={RatingPlayersPage} />
      <PrivateRoute path="/rating/players" component={RatingPlayersPage} />
      <PrivateRoute path="/rating/teams" component={RatingTeamsPage} />
      <PrivateRoute
        path="/tournament/:tournamentId/:tabName?"
        component={TournamentPage}
      />
      <PrivateRoute path="/tournaments/:tabName?" component={TournamentsPage} />
      <PrivateRoute path="/chat/rooms" component={ChatRoomsPage} />
      <PrivateRoute path="/chat/room/:name" component={ChatRoomPage} />
      <PrivateRoute path="/notifications" component={NotificationsPage} />
      <PrivateRoute path="/settings/:tabName?" component={PlayerSettingsPage} />

      <PrivateRoute
        exact
        path="/profile/:username/:tab?/:subTab?/"
        component={ProfilePage}
      />
      <PrivateRoute
        path="/team/profile/:teamName"
        component={TeamProfilePage}
      />
      <PrivateRoute path="/team/settings/:tab?" component={TeamSettingsPage} />
      <PrivateRoute
        path="/reglament/team"
        component={ReglamentTournamentTeam}
      />

      {/* ADMIN */}
      <AdminRoute
        path="/admin/tournament/:tournamentId?"
        component={AdminTournamentPage}
      />
      <AdminRoute path="/admin/notifications" component={AdminNotification} />
    </Switch>
  );
};

export default Pages;
