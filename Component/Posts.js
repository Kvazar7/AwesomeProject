import React, { useState, useEffect } from "react";
import {  StyleSheet, 
          Text, 
          View, 
          FlatList,
          Image, 
          TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCommentCountForPost } from "../Services/ComentsService";

const Posts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem('posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          setPosts(JSON.parse(storedPosts));

          // Отримуємо кількість коментарів для кожного поста
          const counts = {};
          for (const post of parsedPosts) {
            const count = await getCommentCountForPost(post.id);
            counts[post.id] = count;
          }
          setCommentCounts(counts);

        }
      } catch (error) {
        console.error('Помилка завантаження постів:', error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const savePosts = async (updatedPosts) => {
      try {
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      } catch (error) {
        console.error('Помилка збереження постів:', error);
      }
    };

    if (route?.params?.newPost) {
      console.log("New post received:", route.params.newPost);
      setPosts((prevPosts) => {
        const isDuplicate = prevPosts.some(post => post.id === route.params.newPost.id);
        if (!isDuplicate) {
          const updatedPosts = [route.params.newPost, ...prevPosts];
          savePosts(updatedPosts);
          return updatedPosts;
        }  
        return prevPosts;
      });
    }
  }, [route.params?.newPost?.id]);

  return (
      <>
        <FlatList
            style={styles.postListContainer}
            data={posts}
            keyExtractor={( item ) => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.postContainer}>
                <Image 
                  source={{ uri: item.photo }}
                  style={styles.postPicture} 
                />
                <Text style={styles.myComent}>
                  {item.description}
                </Text>
                <View style={styles.discription}>
                  <TouchableOpacity 
                    style={styles.leftPartDiscription}
                    onPress={() => navigation.navigate('ComentsScreen', { post: item })}
                  >
                    <Image style={styles.comentsIcon} source={require('../Img/noOneCommentIcon.png')} />
                    <Text style={styles.comentCounter}>
                      {commentCounts[item.id] || 0} {/* Відображаємо кількість коментарів */}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rightPartDiscription}
                    onPress={() => navigation.navigate('MapScreen', { 
                      latitude: item.locationCoord.latitude, 
                      longitude: item.locationCoord.longitude,
                      description: item.description,
                    })}
                  >
                    <Image style={styles.locationIcon} source={require('../Img/locationIcon.png')} />
                    <Text style={styles.locationDiscription}>
                      {item.locationInput}
                    </Text>
                  </TouchableOpacity>
                </View>
            </View>

          )}
        />
      </>
  );
};

const styles = StyleSheet.create({
    
  postListContainer: {
    // flex: 1,
    paddingTop: 32,
    paddingBottom: 32,
    marginBottom: 200, // зроблено трохи навмання, для відступу від TAB-bar, треба якось окультурити ))

  },

  postContainer: {
    marginBottom: 32,
    
  },

  postPicture: {
    marginBottom: 8,
    width: '100%',
    height: undefined,
    aspectRatio: 17/12,

    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,

  },

  myComent: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',

  },

  discription: {
    marginTop: 8,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    
  },

  leftPartDiscription: {
    flexDirection: 'row',

  },

  rightPartDiscription: {
    flexDirection: 'row',

  },

  comentsIcon: {
    flexDirection: 'row',
    marginRight: 4,

  },

  locationIcon: {
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 6,
    
  },

  locationDiscription: {
    textDecorationLine: 'underline',
    
  },

});

export default Posts;