import { message, Modal } from 'antd';
import { ScaleButton } from 'components';
import { Button, ControlledInput } from 'components/elements';
import { BranchProduct, DEFAULT_PAGE, useBranchProducts } from 'ejjy-global';
import { MAX_PAGE_SIZE } from 'global';
import React, { useState } from 'react';
import { useCurrentTransactionStore } from 'stores';
import { cn } from 'utils';
import { getBranchId } from 'utils/function';

const TEXTCODE_MAX_LENGTH = 10;
const NUMPAD_CLEAR = -1;
const inputs = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0];

type Props = {
	onSelectProduct: (product: BranchProduct) => void;
	onClose: () => void;
};

export const WeightTextcodeModal = ({ onSelectProduct, onClose }: Props) => {
	// STATES
	const [textcode, setTextcode] = useState('');

	// CUSTOM HOOKS
	const { transactionProducts } = useCurrentTransactionStore();
	const { isFetching: isFetchingBranchProducts, refetch: fetchBranchProducts } =
		useBranchProducts({
			params: {
				branchId: Number(getBranchId()),
				isShownInScaleList: true,
				ordering: '-product__textcode',
				page: DEFAULT_PAGE,
				pageSize: MAX_PAGE_SIZE,
				search: textcode,
			},
			options: {
				enabled: false,
				refetchOnMount: false,
				onSettled: (data, error) => {
					if (error || !data?.list) {
						message.error('An error occurred while searching the product.');
						return;
					}

					const branchProduct = data.list.find(
						(item) => item.product.textcode === textcode,
					);

					if (!branchProduct) {
						message.error('Product does not exist.');
						return;
					}

					if (branchProduct) {
						const transactionProduct = transactionProducts.find(
							({ id }) => id === branchProduct.id,
						);

						if (transactionProduct) {
							message.warning('Product is already on your cart.');
							return;
						}

						const {
							markdown_price_per_piece1,
							markdown_price_per_piece2,
							price_per_piece,
						} = branchProduct;

						onSelectProduct({
							...branchProduct,
							markdown_price_per_piece1,
							markdown_price_per_piece2,
							price_per_piece,
						});

						onClose();
					}
				},
			},
		});

	// METHODS
	const handleNumpadInput = (key: number) => {
		if (key === NUMPAD_CLEAR) {
			setTextcode((value) =>
				value.length > 0 ? value.substring(0, value.length - 1) : '',
			);
		} else {
			setTextcode((value) => `${value}${key}`);
		}
	};

	const handleSubmit = () => {
		if (textcode.length === 0) {
			message.warning('Please input a textcode first.');
			return;
		}

		fetchBranchProducts();
	};

	return (
		<Modal
			footer={null}
			title="Search Product By Textcode"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<div className="grid w-full grid-cols-3 grid-rows-5 gap-3">
				<ControlledInput
					className="col-span-3 col-start-1 text-center text-4xl font-bold text-dark"
					value={textcode}
					disabled
					onChange={(value: string) => setTextcode(value)}
				/>

				{inputs.map((number) => (
					<ScaleButton
						key={number}
						className={cn('h-20 text-[2rem]', {
							'col-span-2 col-start-1': number === 0,
						})}
						disabled={textcode.length >= TEXTCODE_MAX_LENGTH}
						title={String(number)}
						onClick={() => handleNumpadInput(number)}
					/>
				))}

				<ScaleButton
					className={cn('h-20 text-[2rem]', {
						'bg-red-500  text-white': textcode.length > 0,
					})}
					disabled={textcode.length === 0}
					title="C"
					onClick={() => handleNumpadInput(-1)}
				/>
			</div>

			<div className="mt-8 grid grid-cols-2 gap-x-5">
				<Button size="lg" text="Cancel" type="button" onClick={onClose} />
				<Button
					loading={isFetchingBranchProducts}
					size="lg"
					text="Submit"
					type="submit"
					variant="primary"
					onClick={handleSubmit}
				/>
			</div>
		</Modal>
	);
};
