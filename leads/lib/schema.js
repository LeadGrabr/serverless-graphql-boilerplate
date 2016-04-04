import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} from 'graphql';

import {
  GraphQLLimitedString
} from 'graphql-custom-types';

import { getLeads, createLead } from './dynamo';

const Lead = new GraphQLObjectType({
  name: "Lead",
  description: "An example business lead",
  fields: () => ({
      id: {type: GraphQLString},
      name: {type: GraphQLString},
      email: {type: GraphQLString},
      phone: {type: GraphQLString}
    })
});

const Query = new GraphQLObjectType({
  name: 'LeadsTestSchema',
  description: "Root of the Leads Test Schema",
  fields: () => ({
    leads: {
      type: new GraphQLList(Lead),
      description: "List of leads",
      resolve: function(source, args) {
        return getLeads();
      }
    }
  })
});

const Mutuation = new GraphQLObjectType({
  name: 'LeadMutations',
  fields: {
    createLead: {
      type: Lead,
      description: "Create lead",
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        phone: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: function(source, args) {
        return createLead(args);
      }
    }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutuation
});

export default Schema;
