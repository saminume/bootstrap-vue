import Tooltip from './tooltip'
import { mount, createLocalVue as CreateLocalVue } from '@vue/test-utils'

describe('tooltip', () => {
  const localVue = new CreateLocalVue()
  const originalCreateRange = document.createRange
  const origGetBCR = Element.prototype.getBoundingClientRect

  beforeEach(() => {
    // https://github.com/FezVrasta/popper.js/issues/478#issuecomment-407422016
    // Hack to make Popper not bork out during tests.
    // Note popper still does not do any positioning claculation in JSDOM though.
    // So we cannot test actual positioning... just detect when it is open.
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    })
    // Mock getBCR so that the isVisible(el) test returns true
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 24,
        height: 24,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }
    })
  })

  afterEach(() => {
    // Reset overrides
    document.createRange = originalCreateRange
    Element.prototype.getBoundingClientRect = origGetBCR
  })

  it('has expected default structure', async () => {
    const App = localVue.extend({
      render(h) {
        return h('article', { attrs: { id: 'wrapper' } }, [
          h('button', { attrs: { id: 'foo', type: 'button' } }, 'text'),
          h(
            Tooltip,
            {
              attrs: { id: 'bar' },
              props: { target: 'foo', trigger: 'click' }
            },
            'title'
          )
        ])
      }
    })
    const wrapper = mount(App, {
      attachToDocument: true,
      localVue: localVue
    })

    expect(wrapper.isVueInstance()).toBe(true)
    await wrapper.vm.$nextTick()

    expect(wrapper.is('article')).toBe(true)
    expect(wrapper.attributes('id')).toBeDefined()
    expect(wrapper.attributes('id')).toEqual('wrapper')

    // The trigger button
    const $button = wrapper.find('button')
    expect($button.exists()).toBe(true)
    expect($button.attributes('id')).toBeDefined()
    expect($button.attributes('id')).toEqual('foo')
    expect($button.attributes('title')).toBeDefined()
    expect($button.attributes('title')).toEqual('')
    expect($button.attributes('data-original-title')).toBeDefined()
    expect($button.attributes('data-original-title')).toEqual('')
    expect($button.attributes('aria-describedby')).not.toBeDefined()

    // b-tooltip wrapper
    const $tipholder = wrapper.find('div#bar')
    expect($tipholder.exists()).toBe(true)
    expect($tipholder.classes()).toContain('d-none')
    expect($tipholder.attributes('aria-hidden')).toBeDefined()
    expect($tipholder.attributes('aria-hidden')).toEqual('true')
    expect($tipholder.element.style.display).toEqual('none')

    // title placeholder
    expect($tipholder.findAll('div.d-none > div').length).toBe(1)
    expect($tipholder.find('div.d-none > div').text()).toBe('title')

    wrapper.destroy()
  })
})
