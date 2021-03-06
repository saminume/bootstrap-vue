import NavForm from './nav-form'
import { mount } from '@vue/test-utils'

describe('nav > nav-form', () => {
  it('has expected default structure', async () => {
    const wrapper = mount(NavForm)

    expect(wrapper.is('form')).toBe(true)
    expect(wrapper.classes()).toContain('form-inline')
    expect(wrapper.classes().length).toBe(1)
    expect(wrapper.text()).toEqual('')
  })

  it('renders default slot content', async () => {
    const wrapper = mount(NavForm, {
      slots: {
        default: 'foobar'
      }
    })

    expect(wrapper.is('form')).toBe(true)
    expect(wrapper.classes()).toContain('form-inline')
    expect(wrapper.classes().length).toBe(1)
    expect(wrapper.text()).toEqual('foobar')
  })
})
