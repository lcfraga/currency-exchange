const assert = require('assert')

const exchangeCurrencies = require('./currency-exchange')

describe('#exchangeCurrencies', function () {
  context('when currencies do not exist', function () {
    context('when currencies are the same', function () {
      const rates = [
        ['EUR', 'USD', 1.1]
      ]

      it('should return the source value', function () {
        const sourceValue = 2

        assert.equal(
          exchangeCurrencies(rates, 'NAC', 'NAC', sourceValue),
          sourceValue
        )
      })
    })

    context('source and target currencies do not exist', function () {
      const rates = [
        ['EUR', 'USD', 1.1]
      ]

      it('should return null', function () {
        assert.equal(
          exchangeCurrencies(rates, 'NAC', 'CAN'),
          null
        )
      })
    })

    context('when source currency does not exist', function () {
      const rates = [
        ['EUR', 'USD', 1.1],
        ['USD', 'EUR', 0.9]
      ]

      it('should return null', function () {
        assert.equal(
          exchangeCurrencies(rates, 'NAC', 'USD'),
          null
        )
      })
    })

    context('when target currency does not exist', function () {
      const rates = [
        ['EUR', 'USD', 1.1],
        ['USD', 'EUR', 0.9]
      ]

      it('should return null', function () {
        assert.equal(
          exchangeCurrencies(rates, 'USD', 'NAC'),
          null
        )
      })
    })
  })

  context('when currencies exist', function () {
    context('when currencies are the same', function () {
      const rates = [
        ['EUR', 'USD', 1.1]
      ]

      it('should return the source value', function () {
        const sourceValue = 4.5

        assert.equal(
          exchangeCurrencies(rates, 'EUR', 'EUR', sourceValue),
          sourceValue
        )
      })
    })

    context('when source currency is first entry in rate array', function () {
      const rates = [
        ['USD', 'EUR', 0.9]
      ]

      it('should return the source value multiplied by exchange rate', function () {
        const sourceValue = 3.2

        assert.equal(
          exchangeCurrencies(rates, 'USD', 'EUR', sourceValue),
          sourceValue * rates[0][2]
        )
      })
    })

    context('when source currency is second entry in rate array', function () {
      const rates = [
        ['USD', 'EUR', 0.9]
      ]

      it('should return the source value multiplied by inverted conversion rate', function () {
        const sourceValue = 1.8
        assert.equal(
          exchangeCurrencies(rates, 'EUR', 'USD', sourceValue),
          sourceValue * (1 / rates[0][2])
        )
      })
    })

    context('when conversion is indirect', function () {
      const rates = [
        ['USD', 'EUR', 0.9],
        ['GBP', 'USD', 1.29],
        ['GBP', 'JPY', 141.40]
      ]

      it('should return the source value multiplied by all intermediate rates', function () {
        const sourceValue = 234.21

        assert.equal(
          exchangeCurrencies(rates, 'USD', 'JPY', sourceValue),
          sourceValue * (1 / rates[1][2]) * rates[2][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'JPY', 'USD', sourceValue),
          sourceValue * (1 / rates[2][2]) * rates[1][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'JPY', 'EUR', sourceValue),
          sourceValue * (1 / rates[2][2]) * rates[1][2] * rates[0][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'EUR', 'JPY', sourceValue),
          sourceValue * (1 / rates[0][2]) * (1 / rates[1][2]) * rates[2][2]
        )
      })
    })

    context('when conversion is indirect (different order)', function () {
      const rates = [
        ['GBP', 'USD', 1.29],
        ['USD', 'EUR', 0.9],
        ['GBP', 'JPY', 141.40]
      ]

      it('should return the source value multiplied by all intermediate rates', function () {
        const sourceValue = 233.65

        assert.equal(
          exchangeCurrencies(rates, 'USD', 'JPY', sourceValue),
          sourceValue * (1 / rates[0][2]) * rates[2][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'JPY', 'USD', sourceValue),
          sourceValue * (1 / rates[2][2]) * rates[0][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'JPY', 'EUR', sourceValue),
          sourceValue * (1 / rates[2][2]) * rates[0][2] * rates[1][2]
        )

        assert.equal(
          exchangeCurrencies(rates, 'EUR', 'JPY', sourceValue),
          sourceValue * (1 / rates[1][2]) * (1 / rates[0][2]) * rates[2][2]
        )
      })
    })
  })
})
