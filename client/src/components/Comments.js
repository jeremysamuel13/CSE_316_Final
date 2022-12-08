import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Input,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import React from "react";
import { useContext, useState, useEffect } from "react";
import GlobalStoreContext from "../store";

const CommentCard = ({ comment }) => {
  return (
    <Card sx={{ margin: "2%" }}>
      <CardContent>
        <Typography variant="overline">
          <b>{comment?.user?.username}</b>
        </Typography>
        <Typography variant="body2">{comment.comment}</Typography>
      </CardContent>
    </Card>
  );
};

const CommentInput = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  return (
    <Box sx={{ margin: "5% 2%" }}>
      <FormControl variant="standard" fullWidth>
        <TextField
          value={input}
          minRows={3}
          autoFocus
          onChange={(event) => setInput(event.target.value)}
          multiline
          label="Share your thoughts!"
          focused
          placeholder="Enter a comment..."
        />
        <Button
          disabled={input.trim().length === 0}
          onClick={() => {
            onSubmit(input);
            setInput("");
          }}
        >
          Comment
        </Button>
      </FormControl>
    </Box>
  );
};

const Comments = () => {
  const { store } = useContext(GlobalStoreContext);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(store.currentList?.comments ?? []);
  }, [store]);

  const handleSubmit = async (comment) => {
    const res = await store.addComment(store.currentList?._id, comment);
    setComments((c) => [...c, res]);
  };

  return (
    <Stack>
      <Box>
        <List style={{ maxHeight: "60vh", overflow: "auto" }}>
          {comments
            ?.slice()
            .reverse()
            .map((c) => (
              <CommentCard key={c._id} comment={c} />
            ))}
        </List>
      </Box>

      <CommentInput onSubmit={handleSubmit} />
    </Stack>
  );
};

export default Comments;
