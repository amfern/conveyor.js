'use strict';

// Nullifies transform if no contact
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformerNeedContact',

    dependencies: [
        'HIDTranslateHorizontal',
        'HIDTranslateVertical',
        'HIDTranslateDepth',
        'HIDjump'
    ],

    requiredDependencies: ['Transformer', 'PhysicsWorld'],

    component: function (args) {
        return args;
    },

    process: function (entities) {
        if (_.isEmpty(entities)) {
            return;
        }

        var entity = _.first(entities);

        if (!entity) {
            return;
        }

        var PhysicsWorld = entity.PhysicsWorld;

        _.each(entities, function (e) {
            var Physics = e.Physics,
                Transformer = e.Transformer;


            // var isContactingAll =
            //         _.every(e.TransformerNeedContact, _.matches({ bi: needContact, bj: Physics, enabled: true })) ||
            //         _.every(e.TransformerNeedContact, _.matches({ bi: Physics, bj: needContact, enabled: true }));



            var isContactingAll = _.every(e.TransformerNeedContact, function(needContact) {
                return _.find(PhysicsWorld.contacts, _.matches({ bi: {id: needContact.id}, bj: {id: Physics.id}, enabled: true })) ||
                    _.find(PhysicsWorld.contacts, _.matches({ bi: {id: Physics.id}, bj: {id: needContact.id}, enabled: true }));
            });

            if (!isContactingAll) {
                Transformer.translation.set(0,0,0);
            }
        });
    }
});
