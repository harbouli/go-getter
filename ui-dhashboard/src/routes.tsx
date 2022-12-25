import { Icon } from "@chakra-ui/react";
import { MdHome } from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";

import Moderators from "views/admin/dataTables";

// Auth Imports
import { RiAdminFill } from "react-icons/ri";
import { ROLES } from "utils/constant";

const routes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
    roles: [ROLES.Admin, ROLES.Auther, ROLES.SuperAdmin],
  },

  {
    name: "Moderators",
    layout: "/admin",
    icon: <Icon as={RiAdminFill} width="20px" height="20px" color="inherit" />,
    path: "/moderators",
    component: Moderators,
    roles: [ROLES.Admin, ROLES.SuperAdmin],
  },
];

export default routes;
