import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { UserContext } from "./UserContext";
import { addCommentToPost, subscribeToComments } from "../Services/ComentsService";

const Coments =({ postId, setLoading }) => {
    const { user } = useContext(UserContext);
    const [ comments, setComments ] = useState([]);
    const [ newComment, setNewComment ] = useState('');

    // useEffect(() => {
    //     const fetchComments = async () => {
    //         setLoading(true);
    //         try {
    //             const fetchedComments = await getCommentsForPost(postId);
    //             setComments(fetchedComments);
    //         } catch (error) {
    //             console.error("Error fetching comments:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchComments();
    // }, [postId]);

    useEffect(() => {
        const unsubscribe = subscribeToComments(postId, (updatedComments) => {
            setComments(updatedComments);
        });
        return () => unsubscribe();
    }, [postId]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('uk-UA', options).replace(',', ' |');
    };
    
    const handleAddComment = async () => {
        setLoading(true);
        if (newComment.trim() === '') return;
        try {
            const comment = {
                text: newComment,
                userId: user.userId,
                userPhoto: user.photoURL,
                postId,
                createdAt: new Date().toISOString(),
            };
            await addCommentToPost(comment);
            // setComments([...comments, comment]);
            setNewComment('');
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const isUserComment = item.userId === user.userId;
        return (
            <View style={[styles.commentContainer, isUserComment ? styles.userComment : styles.otherComment]}>
                {!isUserComment && <Image source={{ uri: item.userPhoto }} style={styles.userPhoto} />}
                <View style={[
                    styles.commentContent,
                    isUserComment ? styles.myCommentText : styles.otherCommentText, // Додаємо стилі тексту до контейнера
                ]}> 
                    <Text style={styles.commentText}>
                        {item.text}
                    </Text>
                    <Text
                        style={[
                            styles.commentDate,
                            isUserComment ? styles.myCommentDate : styles.otherCommentDate
                        ]}
                    >
                        {formatDate(item.createdAt)}
                    </Text>
                </View>
                {isUserComment && <Image source={{ uri: user.photoURL }} style={styles.userPhoto} />}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={comments.filter((item) => item.id)}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
            />
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Напишіть коментар..."
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                    <Image style={styles.trashIcon} source={require('../Img/Vector.png')} />
                </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },

    commentContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'flex-start',
    },

    commentContent: {
        flex: 1,
    },

    flatListContent: {
        paddingBottom: 80, // Додаємо відступ, щоб не перекривати елементи inputContainer
    },

    userComment: {
        // flexDirection: 'row', // Розташовуємо фото праворуч
        // alignItems: 'flex-start',
    },

    otherComment: {
        // flexDirection: 'row', // Розташовуємо фото ліворуч
        // alignItems: 'flex-start',
    },

    userPhoto: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginHorizontal: 16, // Відступ між фото та текстом
    },

    commentContent: {
        flex: 1,
        padding: 16,
        borderRadius: 10,
        maxWidth: '70%',
        flexShrink: 1,
        backgroundColor: '#E5E5E5', // Загальний фон для коментарів
    },
    
    myCommentText: {
        borderTopRightRadius: 0,
        marginLeft: '20%',
        
    },

    otherCommentText: {
        borderTopLeftRadius: 0,
        marginRight: '20%',
        
    },

    commentText: {
        fontSize: 16,
        lineHeight: 18,
        color: '#212121',
    },

    commentDate: {
        fontSize: 12,
        lineHeight: 14,
        color: '#BDBDBD',
        marginTop: 4,
    },

    myCommentDate: {
        textAlign: 'right', // Вирівнюємо дату до правого краю
    },

    otherCommentDate: {
        textAlign: 'left', // Вирівнюємо дату до лівого краю
    },

    inputContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },

    inputWrapper: {
        position: 'relative', // Відносне позиціонування для кнопки всередині
        width: '100%',
    },

    input: {
        flex: 1,
        height: 50,
        placeholderTextColor: '#BDBDBD',
        backgroundColor: '#F6F6F6',
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingRight: 50, // Додаємо відступ для кнопки
        fontSize: 16,
        color: '#212121',
    },

    button: {
        position: 'absolute',
        right: 8, // Відступ від правого краю інпуту
        top: '50%', // Розташування по центру вертикалі
        transform: [{ translateY: -17 }], // Вирівнюємо по центру
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6C00',
        borderRadius: 17,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    
});

export default Coments;