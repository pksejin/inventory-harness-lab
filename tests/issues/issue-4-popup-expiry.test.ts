import { describe, expect, it } from 'vitest'
import { isPopupVisible } from '@/lib/popup'

const REFERENCE_DATE = new Date(Date.UTC(2026, 7, 26))

function utcDate(day: number, hours = 0, minutes = 0, seconds = 0) {
  return new Date(Date.UTC(2026, 7, day, hours, minutes, seconds))
}

describe('Issue 4 — 팝업 노출 종료일', () => {
  it('오늘 이전 종료일은 진행 중 목록에 노출하지 않는다', () => {
    expect(isPopupVisible(utcDate(25), REFERENCE_DATE)).toBe(false)
  })

  it('종료일 당일에는 팝업을 노출한다', () => {
    expect(isPopupVisible(utcDate(26, 23, 59, 59), REFERENCE_DATE)).toBe(true)
  })

  it('종료일 다음 날부터 팝업을 노출하지 않는다', () => {
    expect(isPopupVisible(utcDate(26), utcDate(27))).toBe(false)
  })

  it('종료일 이후 시각은 날짜 경계를 기준으로 판정한다', () => {
    expect(isPopupVisible(utcDate(25, 23, 59, 59), utcDate(25))).toBe(true)
    expect(isPopupVisible(utcDate(25, 23, 59, 59), utcDate(26))).toBe(false)
  })
})
