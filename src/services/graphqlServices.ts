import axios, { AxiosError, AxiosResponse } from "axios";
  
export const executeGraphQLQuery = async (query: string) => {
    try {
      const graphqlResponse: AxiosResponse = await axios.post('http://localhost:4000/graphql', {
        query,
      });

      if(graphqlResponse?.data?.errors){
        throw new Error(graphqlResponse.data.errors[0].message);
      }

      return graphqlResponse.data.data;

    } catch (error:any) {  

      throw error;

    }
  };

