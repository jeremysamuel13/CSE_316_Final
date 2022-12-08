import { useContext, useState } from "react";
import { GlobalStoreContext, SortType } from "../store";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Person4Icon from "@mui/icons-material/Person4";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import SortIcon from "@mui/icons-material/Sort";
import { useHistory } from "react-router-dom";
import { Stack } from "@mui/system";
import AuthContext from "../auth";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const SortingFields = [
  {
    sort: SortType.NAME,
    value: "Name (A-Z)",
    published: true,
    home: true,
  },
  {
    sort: SortType.DATE,
    value: "Publish Date (Newest)",
    published: true,
  },
  {
    sort: SortType.LISTENS,
    value: "Listens (High - Low)",
    published: true,
  },
  {
    sort: SortType.LIKES,
    value: "Likes (High - Low)",
    published: true,
  },
  {
    sort: SortType.DISLIKES,
    value: "Dislikes (High - Low)",
    published: true,
  },
  {
    sort: SortType.CREATE_DATE,
    value: "Creation Date (Old-New)",
    home: true,
  },
  {
    sort: SortType.LAST_EDIT_DATE,
    value: "Last Edit Date (New-Old)",
    home: true,
  },
];

const NavBar = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const [search, setSearch] = useState("");

  const path = window.location.pathname;
  const published = path.startsWith("/all") || path.startsWith("/user");

  const onSelect = (event) => {
    if (published) {
      store.sort(event.target.attributes.sort.value);
    } else {
      store.sortUser(event.target.attributes.sort.value);
    }
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ margin: "3px 5px", backgroundColor: "#b105e3" }}
    >
      <Toolbar>
        <Box>
          <IconButton
            disabled={!auth.loggedIn}
            onClick={() => history.push("/home")}
          >
            <HomeIcon />
          </IconButton>
          <IconButton onClick={() => history.push("/all")}>
            <PeopleAltIcon />
          </IconButton>
          <IconButton onClick={() => history.push("/user")}>
            <Person4Icon />
          </IconButton>
        </Box>
        <Stack direction="row">
          <Search>
            <StyledInputBase
              placeholder="Search…"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  store.setSearch(search);
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <IconButton onClick={(e) => store.setSearch(search)}>
            <SearchIcon />
          </IconButton>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          <Button onClick={(event) => setAnchorEl(event.target)}>
            <Typography
              variant="bold"
              fontFamily="'Roboto', sans-serif"
              color="black"
            >
              SORT BY
            </Typography>
            <SortIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
          >
            {SortingFields.filter((x) => {
              if (published) {
                return x.published;
              }
              return x.home;
            }).map((s) => (
              <MenuItem key={s.sort} sort={s.sort} onClick={onSelect}>
                {s.value}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
