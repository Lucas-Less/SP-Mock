console.log('[SP] - Sitemap v1.5')
SalesforceInteractions.setLoggingLevel('debug')

try {
  SalesforceInteractions.init({
    consents: [{
      purpose: 'Data Cloud Web SDK',
      provider: 'Default OptIn',
      status: SalesforceInteractions.ConsentStatus.OptIn
    }]
  }).then(() => {
    SalesforceInteractions.initSitemap({
      global: {},
      pageTypes: [
        createPageConfig()
      ]
    })
    console.log('[SP] - Sitemapping v1.0 Initiallized')
  })

//  document.addEventListener(SalesforceInteractions.DataCloud.CustomEvents.OnEventSend, (event) => {
//      SalesforceInteractions.log.debug('[CDP SendEvent]: ', JSON.stringify(event.detail, null, 2))
//  })
  
  document.addEventListener(SalesforceInteractions.CustomEvents.OnConsentRevoke, () => {
    console.log('[SP] - Consent revoked')
    SalesforceInteractions.reinit()
  })
} catch (e) {
  SalesforceInteractions.log.error(e)
}

function createPageConfig () {
  return {
    name: 'Homepage',
    isMatch: () => /\/sp-mockup-lucasless/.test(window.location.href),
    interaction: {
        name: "Page View",
        eventType: "websiteEngagement",
        id: "Home",
        type: "View"
    },
    contentZones: [
        { name: "recommendations_banner", selector: "#hero-slide-1" },
    ],
    listeners: [
      SalesforceInteractions.listener('click', '.product-image-wrapper', (event) => {
        console.log(`[SP] - Click Button`+ event.currentTarget )
        SalesforceInteractions.sendEvent({
          interaction: {
            name: "View Page Object",
                name : "Click Button",
                eventType : "catalog",
                catalogObjectType : "Product",
                catalogObjectId: "ProductGeneric",
                type: "Click",
                id: "Product00001",
                interactionName: "Click P0001"
          }
        })
      }),
      SalesforceInteractions.listener('click', '#list-cart-btn-101', () => {
        console.log('[SP] - Luxury Ergonomic Chair')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: 'Product',
              id: 101
            }
          }
        })
      }),
      SalesforceInteractions.listener('click', '#list-cart-btn-102', () => {
        console.log('[SP] - 4K Ultra-Wide Monitor')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: 'Product',
              id: 102
            }
          }
        })
      }),
        SalesforceInteractions.listener('click', '#list-cart-btn-103', () => {
        console.log('[SP] - Wireless Mechanical Keyboard')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: 'Product',
              id: 103
            }
          }
        })
      }),
      SalesforceInteractions.listener('click', '#list-cart-btn-104', () => {
        console.log('[SP] - Noise-Cancelling Headphones')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: SalesforceInteractions.CatalogObjectInteractionName.ViewCatalogObject,
            catalogObject: {
              type: 'Product',
              id: 104
            }
          }
        })
      }),

      SalesforceInteractions.listener('click', '#register', () => {
        SalesforceInteractions.reinit()
        const email = window.email
        const phone = window.phonenumber
        const firstname = window.firstname
        const lastname = window.lastname

        if (email) {
          SalesforceInteractions.sendEvent({
            user: {
              attributes: {
                email: email,
                eventType: 'contactPointEmail'

              }
            }
          })
        }
        if (phone) {
          SalesforceInteractions.sendEvent({
            user: {
              attributes: {
                phoneNumber: phone,
                eventType: 'contactPointPhone'
              }
            }
          })
        }
        SalesforceInteractions.sendEvent({
          user: {
            attributes: {
              firstName: firstname || '',
              lastName: lastname || '',
              eventType: 'identity',
              isAnonymous: 0
            }
          }
        })

      }),
      SalesforceInteractions.listener('click', '#addToCart', () => {
        console.log('add to cart clicked')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: 'Add To Cart',
            lineItem: {
              catalogObjectType: 'Product',
              catalogObjectId: 'product-1',
              price: 10,
              quantity: 3,
              attributes: {
                sku: 'product-1-sku'
              }
            }
          }
        })
      }),
      SalesforceInteractions.listener('click', '#remove', () => {
        console.log('remove to cart clicked')
        SalesforceInteractions.sendEvent({
          interaction: {
            name: 'Remove From Cart',
            lineItem: {
              catalogObjectType: 'Product',
              catalogObjectId: 'product-1',
              price: 10,
              quantity: 3,
              attributes: {
                sku: 'product-1-sku'
              }
            }
          }
        })
      }),
      SalesforceInteractions.listener('click', 'button.submit-shipping', () => {
        console.log('submit order')
        const totalValue = parseFloat(SalesforceInteractions
          .cashDom('.slds-size_1-of-3.order-summary > dl:nth-child(4) > dd')
          .text()
          .trim()
          .replace('$', '')
        )
        const catalogObjectId = SalesforceInteractions
          .cashDom('div.slds-col.slds-size_2-of-3.checkout-form > fieldset > div > div:nth-child(2) > dl > dd')
          .text()
          .trim()
        SalesforceInteractions.sendEvent({
          interaction: {
            name: 'Purchase',
            order: {
              id: `order-${Date.now()}`,
              totalValue: totalValue,
              currency: 'USD',
              lineItems: [{
                catalogObjectType: 'Product',
                catalogObjectId: catalogObjectId,
                quantity: 1
              }]
            }
          }
        })
      }),
    ]
  }
}