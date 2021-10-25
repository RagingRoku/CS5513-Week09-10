import { Flex, Heading, Text, VStack, Link } from "@chakra-ui/react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import Header2 from "../../components/Header2";
import firebase from 'firebase/app';
import 'firebase/firestore';

const SingleContact = ({itemData}) => {
  const AuthUser = useAuthUser()


  return (
    <>
      <Flex>
        <VStack w="full">
          <Header2
          email={AuthUser.email} 
          signOut={AuthUser.signOut} />
          
          <Heading>
            {itemData.name}
          </Heading>
        </VStack>

      </Flex>
      <Flex justifyContent="center">
        <Text> {itemData.phone} </Text>
      </Flex>
      <Flex justifyContent="center">
        <Text> {itemData.email}</Text>
      </Flex>

    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params}) => {
    // get id from url and make a db query
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("contacts").doc(params.id).get();

    let itemData;
    if(!doc.empty){
      //document found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.firstName + " " +  docData.lastName,
        phone: docData.phone,
        email: docData.email,

      };
    } else {
      //no docs found
      itemData = null;
    }
    // return data
    return{
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  }
)(SingleContact)