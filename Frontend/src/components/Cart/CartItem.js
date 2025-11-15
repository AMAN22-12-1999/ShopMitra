import React from 'react';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';

const money = n => Number(n || 0).toFixed(2);

export default function CartItem({ item, value }) {
    const { id, title, img, price, total, count } = item;
    const { increment, decrement, removeItem } = value;

    return (
        <ThemeConsumer>
            {({ theme }) => (
                <Row $dark={theme} role="row">
                    {/* Product image */}
                    <Cell $align="center">
                        <Thumb src={img} alt={title} />
                    </Cell>

                    {/* Name */}
                    <Cell>
                        <Name $dark={theme}>{title}</Name>
                    </Cell>

                    {/* Price */}
                    <Cell $align="center">
                        <Price $dark={theme}>${money(price)}</Price>
                    </Cell>

                    {/* Quantity stepper */}
                    <Cell $align="center">
                        <Stepper aria-label={`Change quantity for ${title}`}>
                            <StepBtn
                                onClick={() => decrement(id)}
                                aria-label={`Decrease ${title} quantity`}
                            >
                                −
                            </StepBtn>
                            <Qty $dark={theme} aria-live="polite">{count}</Qty>
                            <StepBtn
                                onClick={() => increment(id)}
                                aria-label={`Increase ${title} quantity`}
                            >
                                +
                            </StepBtn>
                        </Stepper>
                    </Cell>

                    {/* Remove */}
                    <Cell $align="center">
                        <Trash
                            className="fas fa-trash"
                            onClick={() => removeItem(id)}
                            role="button"
                            title="Remove item"
                            aria-label={`Remove ${title}`}
                        />
                    </Cell>

                    {/* Line total */}
                    <Cell $align="right">
                        <LineTotal $dark={theme}>
                            Item Total : <strong>${money(total)}</strong>
                        </LineTotal>
                    </Cell>
                </Row>
            )}
        </ThemeConsumer>
    );
}

/* ---------------- styled-components ---------------- */

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2fr 1fr 1.4fr;
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid
    ${({ $dark }) => ($dark ? 'rgba(148,163,184,.18)' : 'rgba(15,23,42,.08)')};

  @media (max-width: 992px) {
    grid-template-columns: 1.5fr 2.5fr 1fr 2fr 1fr 1.2fr;
    padding: 12px 10px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 54px 1fr 86px;
    grid-auto-rows: auto;
    gap: 8px 12px;

    /* stack: image | name | total; second row: price | qty | trash */
    & > *:nth-child(1) { grid-column: 1 / 2; }
    & > *:nth-child(2) { grid-column: 2 / 4; }
    & > *:nth-child(6) { grid-column: 3 / 4; text-align: right; }

    & > *:nth-child(3) { grid-column: 1 / 2; }
    & > *:nth-child(4) { grid-column: 2 / 3; }
    & > *:nth-child(5) { grid-column: 3 / 4; }
  }
`;

const Cell = styled.div`
  text-align: ${({ $align }) => $align || 'left'};
`;

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0,0,0,.08);
    background: ${({ theme }) => (theme?.theme ? '#0b1220' : '#ffffff')};
  box-shadow: ${({ theme }) =>
        theme?.theme ? '0 4px 10px rgba(0,0,0,.45)' : '0 6px 14px rgba(0,0,0,.08)'};
`;

const Name = styled.div`
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
  font-weight: 600;
  line-height: 1.35;
`;

const Price = styled.span`
   font-weight: 700;
   letter-spacing: .3px;
   color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#1f2937')};
`;

const Stepper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StepBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(148,163,184,.35);
  background: #ffffff;
  font-size: 18px;
  font-weight: 800;
  line-height: 0;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0,0,0,.06);
  transition: transform .08s ease, background .15s ease, box-shadow .15s;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const Qty = styled.span`
  min-width: 32px;
  display: inline-flex;
  justify-content: center;
  font-weight: 700;
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
`;

const Trash = styled.i`
  color: #f59e0b;
  font-size: 20px;
  cursor: pointer;
  transition: transform .12s ease, filter .2s ease;

  &:hover { transform: translateY(-1px); filter: brightness(1.1); }
`;

const LineTotal = styled.div`
  font-size: .95rem;
  color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#334155')};
  strong {
    color: ${({ $dark }) => ($dark ? '#93c5fd' : '#1e40af')};
  }
`;
