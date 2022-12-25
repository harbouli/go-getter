import { Icon } from "@chakra-ui/react";
import { MdHome, MdLock } from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";

import Moderators from "views/admin/dataTables";

// Auth Imports
import { RiAdminFill } from "react-icons/ri";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },

  {
    name: "Moderators",
    layout: "/admin",
    icon: <Icon as={RiAdminFill} width="20px" height="20px" color="inherit" />,
    path: "/moderators",
    component: Moderators,
  },
];

export default routes;
