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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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

const NavBar = () => {
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const [search, setSearch] = useState("");

  const onSelect = (event) => {
    store.sort(event.target.attributes.sort.value);
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ margin: "3px 5px" }}>
      <Toolbar>
        <Box>
          <IconButton onClick={() => history.push("/home")}>
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
            <MenuItem sort={SortType.NAME} onClick={onSelect}>
              Name (A-Z)
            </MenuItem>
            <MenuItem sort={SortType.DATE} onClick={onSelect}>
              Publish Date (Newest)
            </MenuItem>
            <MenuItem sort={SortType.LISTENS} onClick={onSelect}>
              Listens (High - Low)
            </MenuItem>
            <MenuItem sort={SortType.LIKES} onClick={onSelect}>
              Likes (High - Low)
            </MenuItem>
            <MenuItem sort={SortType.DISLIKES} onClick={onSelect}>
              Dislikes (High - Low)
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
