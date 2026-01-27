SalesforceInteractions.setLoggingLevel(5);
SalesforceInteractions.Personalization.Config.initialize({
  customFlickerDefenseConfig: {
    redisplayTimeoutMilliseconds: 2000,
    renderPersonalizationAfterTimeoutElapsed: false,
  },
  additionalTransformers: [
    {
      name: "SimpleRecs",
      transformerType: "Handlebars",
      substitutionDefinitions: {
        recs: { defaultValue: "[data]" },
        id: { defaultValue: "[ssot__Id__c]" },
        image: { defaultValue: "[ImageURL__c]" },
        name: { defaultValue: "[ssot__Name__c]" },
        price: { defaultValue: "[UnitPrice__c]" },
      },
      transformerTypeDetails: {
        html: `
                <div class="sfdcep-recs-carousel">
                    {{#each (subVar 'recs')}}
                        <div class="sfdcep-recs-item">
                            <img src="{{subVar 'image'}}" />
                            <p> ID : {{subVar 'id'}}
                            <p> Price : $ {{subVar 'price'}} </p>
                            <p> Name : {{subVar 'name'}} </p>
                        </div>
                    {{/each}}
                </div>
            `,
      },
    },
    {
      name: "SimpleHero",
      transformerType: "Handlebars",
      substitutionDefinitions: {
        BackgroundImageUrl: { defaultValue: "[attributes].[BackgroundImageUrl]" },
        Header: { defaultValue: "[attributes].[Header]" },
        Subheader: { defaultValue: "[attributes].[Subheader]" },
        CallToActionUrl: { defaultValue: "[attributes].[CallToActionUrl]" },
        CallToActionText: { defaultValue: "[attributes].[CallToActionText]" },
      },
      transformerTypeDetails: {
        html: `
                <div style="background: url('{{subVar 'BackgroundImageUrl'}}') no-repeat center center;">
                    <div>{{subVar 'Header'}}</div>
                    <div>{{subVar 'Subheader'}}</div>
                    <div>
                        <a href="{{subVar 'CallToActionUrl'}}">
                            {{subVar 'CallToActionText'}}
                        </a>
                    </div>
                </div>
            `,
      },
    },
  ],
});
/* ========= END: PERSONALIZATION INITIALIZATION ========= */

SalesforceInteractions.init({
    personalization: { dataspace: 'default' },
    cookieDomain: 'testesalesforce.weebly.com',
    consents: [{
      purpose: 'Data Cloud Web SDK',
      provider: 'Default OptIn',
      status: SalesforceInteractions.ConsentStatus.OptIn
    }]
  }).then(() => {
    console.log('Data Cloud SDK v24');

    // 3. Configuração mínima de site mapping
    const config = {
      global: {
        // Captura parâmetro ?mcsubscriberkey=123
        onActionEvent: (actionEvent) => {
          const params = new URLSearchParams(window.location.search.toLowerCase());
          const id = params.get('mcsubscriberkey');
          console.log("Parametro capturado: " + id);
          if (id) {
            console.log("Entrou");
            actionEvent.user = {
              attributes: {
                  category: 'Profile',
                  martechDNI: id.toUpperCase(),
                  eventType: 'identity',
                  IDName : "DNI",
                  IDType: "Person Identifier",
                  isAnonymous: 0
                
              }
            };
          }
          console.log(actionEvent);
          return actionEvent;
        }
        
        ,
        listeners: []
      },

      // Página específica
      pageTypes: [
        {
          name: 'Homepage',
          locale: navigator.language,
          isMatch: () => window.location.pathname === '/' || window.location.pathname === '/index.html',
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: { type: 'Page', id: 'Homepage' }
          },
          contentZones: [
              { name: "recommendations_1", selector: "#banner" },
    	],
          listeners: [
          SalesforceInteractions.listener("click", ".btn-prueba", () => {
                SalesforceInteractions.sendEvent({
                        interaction: {
                          name : "Click Plan",
                          eventType : "userEngagement",
                          catalogObjectType : "Banner",
                          catalogObjectId: "Teste",
                          type: "Click",
                          id: "Phone",
                          interactionName: "Click Phone"
                        // Could also consider providing optional "categoryId"
                        }
                      })
             SalesforceInteractions.sendEvent({
                      interaction: {
                        name: "partyIdentification"
                      },
                      user: {
                        attributes: {
                          eventType: "partyIdentification",
                          userId: "AR_DNI_65897432_M",
                          IDName: "DNI",
                          IDType: "Person Identifier",
                          category: "Profile"
                        }
                      }
                    });


          }),
          SalesforceInteractions.listener("click", "DIV.product-grid.product-grid-columns--3.product-grid-layout--above > DIV:nth-child(1) > A.product-grid__item-overlay", () =>{
                  SalesforceInteractions.sendEvent({
                        interaction: {
                          name : "Click Plan",
                          eventType : "userEngagement",
                          catalogObjectType : "Banner",
                          catalogObjectId: "Teste",
                          type: "Click",
                          id: "Phone",
                          interactionName: "Click Phone"
                        // Could also consider providing optional "categoryId"
                        }
                      })
          })

          ]
        },
        {
        name: 'Store Pages',
        locale: navigator.language,
        isMatch: () => /^\/store\/.+/.test(window.location.pathname),
        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: {
            type: 'Page',
            id: (() => {
              const match = window.location.pathname.match(/\/([^\/]+)\.html$/i);
              return match ? match[1] : window.location.pathname;
            })()
          }
        },
        contentZones: [],
        listeners: []
      }
      ],

      // Página default (fallback)
      pageTypeDefault: {
        locale: navigator.language,
        name: 'Default',
        interaction: {
          name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
          catalogObject: { type: 'Page', id: 'Default' }
        }
      }
    };

    // 4. Inicializa o site mapping
    SalesforceInteractions.initSitemap(config);
  });