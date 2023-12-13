import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Content from '../Dashboard/Content';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
  CircularProgress,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Typography as MuiTypography,
  Link,
} from '@mui/material';
import { red } from '@mui/material/colors';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Fab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getForums, getUsers } from '../Redux/apiCalls';
import { useHistory } from 'react-router-dom';
import backgroundAnimation from './g.gif';

const backgroundStyles = {
  backgroundImage: `url(${backgroundAnimation})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative', // Add this line
  backgroundAttachment: 'fixed', // Add this line
  backgroundRepeat: 'repeat', // Add this line
};

const SearchResultCard = ({ searchQuery, reviewStats }) => (
  <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: '16px', color: 'white', borderColor: 'white' }} elevation={0}>
    <CardContent>
      <Typography variant="h5" color="primary">
        Topic: {searchQuery}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Number of Reviews: {reviewStats.totalReviews || 0}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Positive Reviews: {reviewStats.positiveReviews || 0}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Negative Reviews: {reviewStats.negativeReviews || 0}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Neutral Reviews: {reviewStats.neutralReviews || 0}
      </Typography>
    </CardContent>
  </Card>
);

const CourseReview = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const loading = useSelector((state) => state.forums.isFetching);
  const forums = useSelector((state) => state.forums.forums);

  const [searchQuery, setSearchQuery] = useState('');
  const [showForumPosts, setShowForumPosts] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    neutralReviews: 0,
  });

  useEffect(() => {
    getForums(dispatch);
    getUsers(dispatch);
  }, [dispatch]);

  const filteredForums = forums.filter(
    (forum) =>
      forum?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum.creator?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      forum?.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setShowForumPosts(false);
  };

  const handleCheckReview = () => {
    // Add logic to handle checking reviews based on the searchQuery
    console.log(`Checking reviews for: ${searchQuery}`);
    // Set the state to show forum posts
    setShowForumPosts(true);

    // Simulate review statistics (replace with actual data retrieval logic)
    setReviewStats({
      totalReviews: filteredForums.length,
      positiveReviews: 0, // Placeholder value
      negativeReviews: 0, // Placeholder value
      neutralReviews: 0, // Placeholder value
    });
  };

  const history = useHistory();

  const handleClick = (postId) => {
    history.push(`/thread/${postId}`);
  };

  return (
    <div style={backgroundStyles}>
      <Content>
        <Typography variant='h3' style={{ color: 'white' }}>
          Course Review Section
        </Typography>
        <Typography variant='h6' style={{ color: 'white' }}>
          Analyze course reviews here
        </Typography>

        <TextField
          label='Search for a course'
          variant='outlined'
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: { color: 'white' },
            backgroundColor: 'white',
            opacity: 0.8,
          }}
        />

        <Button
          variant='contained'
          color='primary'
          onClick={handleCheckReview}
          style={{ margin: '16px 0' }}
        >
          Check Review
        </Button>

        {showForumPosts && <SearchResultCard searchQuery={searchQuery} reviewStats={reviewStats} />}

        {showForumPosts && (
          <Grid container spacing={3}>
            {filteredForums.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card sx={{ maxWidth: 345, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderColor: 'white' }} elevation={3}>
                  <CardActionArea onClick={() => handleClick(post._id)} disableRipple>
                    <CardHeader
                      avatar={
                        <Link to={`/userprofile/${post.creator?._id}`}>
                          <Avatar sx={{ bgcolor: red[500] }} aria-label='forum' src={post.creator?.photo} />
                        </Link>
                      }
                      action={
                        <IconButton aria-label='settings'>
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={<Typography style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{post.title}</Typography>}
                      subheader={
                        <Link to={`/userprofile/${post.creator?._id}`}>
                          @{post.creator?.displayName || 'deleted_user'}
                        </Link>
                      }
                    />
                    <CardContent>
                      <Typography variant='body2' color='text.secondary' dangerouslySetInnerHTML={{ __html: post.description }} />
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label='upvotes'>
                        <ArrowDropUpIcon />
                      </IconButton>
                      <Typography variant='body2' color='text.secondary'>
                        {post.upVotes.length - post.downVotes.length || 0}
                      </Typography>
                      <IconButton aria-label='replies'>
                        <ChatIcon />
                      </IconButton>
                      <Typography variant='body2' color='text.secondary'>
                        {post?.replies.length || 0}
                      </Typography>
                      <IconButton aria-label='add to favorites'>
                        <FavoriteIcon />
                      </IconButton>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {loading && <CircularProgress style={{ color: 'white' }} />}
      </Content>
    </div>
  );
};

export default CourseReview;
